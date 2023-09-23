// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { RubyRingV1 } from "../src/RubyRingV1.sol";

contract RubyRingTestV1 is Test {
    RubyRingV1 public instance;

    event Trade(
        address trader,
        address subject,
        bool isBuy,
        uint256 shareAmount,
        uint256 ethAmount,
        uint256 protocolEthAmount,
        uint256 subjectEthAmount,
        uint256 supply
    );

    function setUp() public {
        instance = new RubyRingV1();
    }

    /****************************************************************************
     * Initialization & Configuration Tests
     ***************************************************************************/

    // Check that the contract owner is the address that deploys the contract.
    function testDefaultOwner() public {
        assertEq(instance.owner(), address(this));
    }

    // Only the owner should be able to set the protocol fee destination.
    function testSetProtocolFeeDestination() public {
        assertEq(instance.protocolFeeDestination(), address(0));
        instance.setFeeDestination(address(1));
        assertEq(instance.protocolFeeDestination(), address(1));
        instance.setFeeDestination(address(2));
        assertEq(instance.protocolFeeDestination(), address(2));

        vm.startPrank(address(0xA)); // Not the owner

        vm.expectRevert();
        instance.setFeeDestination(address(3));

        vm.stopPrank();
    }

    // Only the owner should be able to set the protocol fee percentage.
    function testSetProtocolFeePercentage() public {
        assertEq(instance.protocolFeePercent(), 0);
        instance.setProtocolFeePercent(1);
        assertEq(instance.protocolFeePercent(), 1);
        instance.setProtocolFeePercent(0.3 ether);
        assertEq(instance.protocolFeePercent(), 0.3 ether);

        vm.expectRevert();
        instance.setProtocolFeePercent(1 ether + 1); // Percentage above 100%

        vm.startPrank(address(0xA)); // Not the owner

        vm.expectRevert();
        instance.setProtocolFeePercent(3);

        vm.stopPrank();
    }

    // Only the owner should be able to set the subject fee percentage.
    function testSetSubjectFeePercentage() public {
        assertEq(instance.subjectFeePercent(), 0);
        instance.setSubjectFeePercent(1);
        assertEq(instance.subjectFeePercent(), 1);
        instance.setSubjectFeePercent(0.5 ether);
        assertEq(instance.subjectFeePercent(), 0.5 ether);

        vm.expectRevert();
        instance.setProtocolFeePercent(1 ether + 1); // Percentage above 100%

        vm.startPrank(address(0xA)); // Not the owner

        vm.expectRevert();
        instance.setSubjectFeePercent(3);

        vm.stopPrank();
    }

    // Only the owner should be able to transfer ownership, and after the transfer, the previous owner shouldn't have special permissions.
    function testTransferOwnership() public {
        assertEq(instance.owner(), address(this));
        instance.transferOwnership(address(1));
        assertEq(instance.owner(), address(1));

        vm.startPrank(address(this)); // Previous owner

        vm.expectRevert();
        instance.transferOwnership(address(2));

        vm.stopPrank();

        vm.startPrank(address(1)); // Current owner

        instance.transferOwnership(address(this)); // Transfer ownership back to the test contract

        vm.stopPrank();

        assertEq(instance.owner(), address(this));
    }

    /****************************************************************************
     * Buying Gems Tests
     ***************************************************************************/

    // Only the subject should be able to buy the first gem.
    function testBuyFirstGem() public {
        vm.startPrank(address(0xA)); // Not the subject

        assertEq(instance.gemsSupply(address(0xA)), 0);
        assertEq(instance.gemsBalance(address(0xA), address(0xA)), 0);

        // Sets 0xA balance to 1 ether
        vm.deal(address(0xA), 1 ether);

        assertEq(address(0xA).balance, 1 ether);

        instance.buyGems{ value: 1 ether }(address(0xA), 1);

        assertEq(instance.gemsSupply(address(0xA)), 1);
        assertEq(instance.gemsBalance(address(0xA), address(0xA)), 1);

        vm.expectRevert();
        instance.buyGems(address(0xB), 1); // Buying the first gem of another subject should fail because only the subject can buy the first gem of a himself.

        vm.stopPrank();

        vm.startPrank(address(0xB));

        vm.deal(address(0xB), 1 ether);

        instance.buyGems{ value: 1 ether }(address(0xA), 1); // I can buy the gem of 0xA because the first gem of 0xA has already been bought by 0xA.

        assertEq(instance.gemsSupply(address(0xA)), 2);
        assertEq(instance.gemsBalance(address(0xA), address(0xA)), 1);
        assertEq(instance.gemsBalance(address(0xA), address(0xB)), 1);

        vm.stopPrank();
    }

    // Test fuzzy buying own gems.
    function testBuyOwnGems(uint8 amount) public {
        vm.assume(amount > 0);

        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 1000 ether);

        instance.buyGems{ value: 1 ether }(address(0xA), 1);

        uint256 buyPrice = instance.getBuyPriceAfterFee(address(0xA), amount);

        instance.buyGems{ value: buyPrice }(address(0xA), amount);

        uint16 amount16 = uint16(amount);

        assertEq(instance.gemsSupply(address(0xA)), amount16 + 1);

        vm.stopPrank();
    }

    // Attempt to buy gems with insufficient payment to cover the costs.
    function testBuyGemsInsufficientPayment() public {
        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 1 ether);

        instance.buyGems{ value: 1 ether }(address(0xA), 1);

        vm.expectRevert();
        instance.buyGems{ value: 0.0000001 ether }(address(0xA), 1);

        vm.stopPrank();
    }

    // Ensure the gems balance of the buyer increases after a successful purchase.
    function testBuyGemsBalance() public {
        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 10 ether);

        instance.buyGems{ value: 0.1 ether }(address(0xA), 1);

        assertEq(instance.gemsBalance(address(0xA), address(0xA)), 1);

        instance.buyGems{ value: 5 ether }(address(0xA), 5);

        assertEq(instance.gemsBalance(address(0xA), address(0xA)), 6);

        vm.stopPrank();
    }

    // Check if the correct Trade event is emitted after buying gems.
    function testBuyGemsEvent() public {
        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 10 ether);

        uint256 price = instance.getBuyPriceAfterFee(address(0xA), 1);
        uint256 protocolFee = (price * instance.protocolFeePercent()) / 1 ether;
        uint256 subjectFee = (price * instance.subjectFeePercent()) / 1 ether;
        uint256 supply = instance.gemsSupply(address(0xA));

        vm.expectEmit();
        emit Trade(
            address(0xA),
            address(0xA),
            true,
            1,
            price,
            protocolFee,
            subjectFee,
            supply + 1
        );
        instance.buyGems{ value: 0.1 ether }(address(0xA), 1);

        vm.stopPrank();
    }

    /****************************************************************************
     * Selling Gems Tests
     ***************************************************************************/

    // Attempt to sell the last share, which should fail.
    function testSellLastShare() public {
        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 1 ether);

        instance.buyGems{ value: 1 ether }(address(0xA), 1);

        vm.expectRevert();
        instance.sellGems(address(0xA), 1);

        vm.stopPrank();
    }

    // Attempt to sell more shares than the subject owns, which should fail.
    function testSellMoreSharesThanOwned() public {
        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 1 ether);

        instance.buyGems{ value: 1 ether }(address(0xA), 1);

        instance.buyGems{ value: 1 ether }(address(0xA), 2);

        vm.expectRevert();
        instance.sellGems(address(0xA), 5);

        vm.stopPrank();
    }

    // Ensure the gems balance of the seller decreases after a successful sale.
    function testSellGemsBalance() public {
        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 10 ether);

        instance.buyGems{ value: 0.1 ether }(address(0xA), 1);

        instance.buyGems{ value: 5 ether }(address(0xA), 4);

        assertEq(instance.gemsBalance(address(0xA), address(0xA)), 5);

        instance.sellGems(address(0xA), 1);

        assertEq(instance.gemsBalance(address(0xA), address(0xA)), 4);

        vm.stopPrank();
    }

    // Ensure fees are transferred correctly and the seller receives the correct amount after fees.
    function testSellGemsFees() public {
        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 10 ether);

        instance.buyGems{ value: 0.1 ether }(address(0xA), 1);

        vm.stopPrank();

        vm.startPrank(address(0xB));

        vm.deal(address(0xB), 10 ether);

        instance.buyGems{ value: 5 ether }(address(0xA), 4);

        uint256 sellPrice = instance.getSellPriceAfterFee(address(0xA), 1);
        uint256 protocolFee = (sellPrice * instance.protocolFeePercent()) /
            1 ether;
        uint256 subjectFee = (sellPrice * instance.subjectFeePercent()) /
            1 ether;

        uint256 balanceBefore = address(0xB).balance;

        instance.sellGems(address(0xA), 1);

        assertEq(
            address(0xB).balance,
            balanceBefore + sellPrice - protocolFee - subjectFee
        );

        vm.stopPrank();
    }

     function testSellerBalanceIncreases() public {
        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 10 ether);

        instance.buyGems{ value: 0.1 ether }(address(0xA), 1);

        instance.buyGems{ value: 5 ether }(address(0xA), 4);

        uint256 sellPrice = instance.getSellPriceAfterFee(address(0xA), 1);
        uint256 protocolFee = (sellPrice * instance.protocolFeePercent()) /
            1 ether;
        uint256 subjectFee = (sellPrice * instance.subjectFeePercent()) /
            1 ether;

        uint256 balanceBefore = address(0xA).balance;

        instance.sellGems(address(0xA), 1);

        assertEq(
            address(0xA).balance,
            balanceBefore + sellPrice - protocolFee - subjectFee
        );

        vm.stopPrank();
    }


    /****************************************************************************
     * Price Calculations Tests
     ***************************************************************************/

    // Check the calculated price when supply is zero.
    function testGetPriceSupplyZero() public {
        assertEq(instance.getPrice(0, 1), 0);

        vm.expectRevert();
        instance.getPrice(0, 2);
    }

    // Check the calculated price as the supply grows to test the sum of squares formula.
    function testGetPriceSupply() public {
        assertEq(instance.getPrice(1, 1), 62500000000000);
        assertEq(instance.getPrice(2, 1), 250000000000000);
        assertEq(instance.getPrice(3, 1), 562500000000000);
        assertEq(instance.getPrice(4, 1), 1000000000000000);

        assertEq(instance.getPrice(1, 2), 312500000000000);
        assertEq(instance.getPrice(34, 5), 405625000000000000);
        assertEq(instance.getPrice(112, 1), 784000000000000000);
    }

    //  Ensure that the buy price is correctly increased by the protocol and subject fees.
    function testGetBuyPriceAfterFee() public {
        vm.startPrank(address(0xA));

        vm.deal(address(0xA), 1 ether);

        instance.buyGems{ value: 1 ether }(address(0xA), 1);

        vm.stopPrank();

        assertEq(instance.getBuyPriceAfterFee(address(0xA), 1), 62500000000000);

        instance.setProtocolFeePercent(0.5 ether);
        instance.setSubjectFeePercent(0.5 ether);

        assertEq(
            instance.getBuyPriceAfterFee(address(0xA), 1),
            125000000000000
        );
    }
}
